import datasource from "../datasource.js";
import { User } from "../entities/user.entity.js";
import bcrypt from "bcryptjs";

export const userSeeder = async () => {
  if (!datasource.isInitialized) {
    await datasource.initialize();
  }
  const userRepository = datasource.getRepository(User);

  const name = "John Doe";
  const email = "example@email.com";
  const role = 'admin';
  const password = "password";

  // check user exist
  const userExist = await userRepository.findOne({ where: { email } });
  if (userExist) {
    console.log("User already exists");
    return;
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = userRepository.create({
    name: name,
    email: email,
    password: hashPassword,
    role: role,
  });

  await userRepository.save(user);
};
