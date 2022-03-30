import { HttpException, HttpStatus } from '@nestjs/common';
import { diskStorage } from 'multer';

import { v4 as uuidv4 } from 'uuid';
import { parse } from 'path';

export const multerOptions = {
    fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|png|jpeg|gif)$/)) {
            cb(null, true)
        } else {
            cb(new HttpException(`Unsupported file type`, HttpStatus.BAD_REQUEST), false)
        }
    },
    storage: diskStorage({
        destination: './images/products',
        filename: (req, file, cb) => {
            const fileName = parse(file.originalname).name.replace(/\s/g, '') + uuidv4()
            const extension = parse(file.originalname).ext
            cb(null, `${fileName}${extension}`)
        }
    })
}