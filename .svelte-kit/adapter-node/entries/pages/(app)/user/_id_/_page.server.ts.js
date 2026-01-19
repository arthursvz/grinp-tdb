import { p as prisma } from "../../../../../chunks/prisma.js";
const load = async ({ params }) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        churros_uid: params.id
      }
    });
    const users = await prisma.user.findMany();
    const slots = await prisma.slot.findMany({
      where: {
        participants: {
          some: {
            id: user.id
          }
        }
      }
    });
    return {
      user,
      users,
      slots
    };
  } catch (error) {
    return {
      status: 404,
      error: "User not found"
    };
  }
};
export {
  load
};
