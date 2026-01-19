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
      const targetUser = await prisma.user.findUnique({
        where: {
          id: user_id
        }
      });
      await prisma.user.update({
        where: {
          id: user_id
        },
        data: {
          cotisant_as: !targetUser?.cotisant_as
        }
      });
      return new Response(JSON.stringify("Cotisant AS status toggled !"), {
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
