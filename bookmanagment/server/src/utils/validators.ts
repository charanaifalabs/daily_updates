export const validateRegister = (body: any) => {
  const { name, email, password } = body;
  if (!name || !email || !password)
    throw new Error("Name, email and password are required");
};
