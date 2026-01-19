import { p as prisma } from "../../../../../chunks/prisma.js";
const POST = async (event) => {
  const { user_id } = await event.request.json();
  const user = event.locals.user;
  const prisma_user = await prisma.user.findUnique({
    where: {
      id: user?.id
    }
  });
  if (prisma_user?.root) {
    try {
      await prisma.user.delete({
        where: {
          id: user_id
        }
      });
      return new Response(JSON.stringify("User deleted !"), {
        status: 200
      });
    } catch (error) {
      console.log(error);
      return new Response(JSON.stringify(error), {
        status: 400
      });
    }
  } else {
    return new Response(JSON.stringify("User not logged in or insufficient permissions !"), {
      status: 400
    });
  }
};
export {
  POST
};
