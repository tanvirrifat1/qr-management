import { SortOrder, Types } from 'mongoose';
import { Message } from './message.model';
import { Inbox } from '../inbox/inbox.model';

const getAllMessages = async (id: string, query: Record<string, unknown>) => {
  const {
    searchTerm,
    page,
    limit,
    sortBy = 'createdAt',
    order = 'desc',
    ...filterData
  } = query;

  const anyConditions: any[] = [{ inboxId: id }];

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({ [field]: value })
    );
    anyConditions.push({ $and: filterConditions });
  }

  // Apply filter conditions
  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const sortOrder: SortOrder = order === 'desc' ? -1 : 1;
  const sortCondition: { [key: string]: SortOrder } = {
    [sortBy as string]: sortOrder,
  };

  const result = await Message.find(whereConditions)
    .sort(sortCondition)
    .skip(skip)
    .limit(size);
  const count = await Message.countDocuments(whereConditions);

  await Inbox.updateOne({ _id: id }, { unreadCount: 0 });

  return {
    result,
    meta: {
      page: pages,
      limit: size,
      total: count,
      totalPages: Math.ceil(count / size),
      currentPage: pages,
    },
  };
};

const getAllRecentMessage = async (
  query: Record<string, unknown>,
  userId: string
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const userObjectId = new Types.ObjectId(userId);

  const data = await Message.aggregate([
    {
      $lookup: {
        from: 'inboxes',
        localField: 'inboxId',
        foreignField: '_id',
        as: 'inbox',
      },
    },
    { $unwind: '$inbox' },

    {
      $match: {
        'inbox.senderId': userObjectId,
      },
    },

    {
      $lookup: {
        from: 'users',
        localField: 'inbox.receiverId',
        foreignField: '_id',
        as: 'receiver',
      },
    },
    { $unwind: '$receiver' },

    { $sort: { createdAt: -1 } },

    {
      $facet: {
        result: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              message: 1,

              // ✅ formatted date & time
              sentAt: {
                $dateToString: {
                  format: '%d %b %Y, %H:%M',
                  date: '$createdAt',
                  timezone: 'Asia/Dhaka', // change if needed
                },
              },

              createdAt: 1, // keep raw date if frontend needs it

              receiver: {
                firstName: '$receiver.firstName',
                lastName: '$receiver.lastName',
                email: '$receiver.email',
                image: '$receiver.image',
              },
            },
          },
        ],
        meta: [{ $count: 'total' }],
      },
    },
  ]);

  return {
    result: data[0]?.result || [],
    meta: {
      page,
      total: data[0]?.meta[0]?.total || 0,
    },
  };
};

export const MessageService = {
  getAllMessages,
  getAllRecentMessage,
};
