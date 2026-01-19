import { p as prisma } from "../../../../../chunks/prisma.js";
const POST = async (event) => {
  const user = event.locals.user;
  const prisma_user = await prisma.user.findUnique({
    where: {
      id: user?.id
    }
  });
  if (prisma_user?.root) {
    try {
      await prisma.user.updateMany({
        data: {
          cotisant_as: false
        }
      });
      return new Response(JSON.stringify("All cotisant AS status reset !"), {
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
