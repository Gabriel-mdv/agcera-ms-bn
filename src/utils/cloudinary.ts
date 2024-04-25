import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// can throw an error
export async function handleUpload(file: Express.Multer.File, folder: string = ''): Promise<string> {
  const b64 = Buffer.from(file.buffer).toString('base64');
  const dataURI = 'data:' + file.mimetype + ';base64,' + b64;

  const result = await cloudinary.uploader.upload(dataURI, {
    folder: `images/${folder}`,
    resource_type: 'image',
    unique_filename: true,
  });
  return result.secure_url;
}

// can throw an error
export async function handleDeleteUpload(url: string) {
  const urlLast = url.split('/images/').pop();
  const publicIdLast = urlLast!.split('.').shift();
  const publicId = `images/${publicIdLast}`;
  return await cloudinary.uploader.destroy(publicId!);
}
