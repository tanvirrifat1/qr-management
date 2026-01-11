export interface MulterFile extends Express.Multer.File {
  location?: string;
}
