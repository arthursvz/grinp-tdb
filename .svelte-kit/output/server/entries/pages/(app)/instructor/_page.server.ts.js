import { p as prisma } from "../../../../chunks/prisma.js";
import { r as redirect } from "../../../../chunks/server.js";
const load = async (event) => {
  const user = event.locals.user;
  if (!user) {
    throw redirect(
      302,
      "/login",
      {
        type: "error",
        message: "Vous devez être connecté pour accéder à cette page !"
      },
      event
    );
  } else {
    try {
      const root = await prisma.user.findUnique({
        where: {
          id: user.id
        }
      }).then((u) => {
        if (u) {
          return u.root;
        } else {
          return false;
        }
      });
      if (!root) {
        throw redirect(
          302,
          "/login",
          {
            type: "error",
            message: "Vous devez être administrateur pour accéder à cette page !"
          },
          event
        );
      }
    } catch (error) {
      throw redirect(
        302,
        "/login",
        {
          type: "error",
          message: "Vous devez être administrateur pour accéder à cette page !"
        },
        event
      );
    }
  }
  const users = await prisma.user.findMany();
  return {
    users
  };
};
export {
  load
};
