export const createUserModel = (mongoose) => {
  let Schema = mongoose.Schema;
  let UserModel = new Schema({
    'user': String
  });
  return DeviceModel = mongoose.model('user', UserModel);
}