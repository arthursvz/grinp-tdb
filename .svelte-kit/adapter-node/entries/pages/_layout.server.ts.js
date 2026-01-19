import { p as prisma } from "../../chunks/prisma.js";
import { l as loadFlash } from "../../chunks/server.js";
const load = loadFlash(async (event) => {
  const user = event.locals.user;
  try {
    if (user) {
      const prisma_user = await prisma.user.findUnique({
        where: {
          id: user.id
        }
      });
      const root = prisma_user?.root;
      const instructor = prisma_user?.instructor;
      return {
        user: event.locals.user,
        root,
        instructor
      };
    } else {
      return {
        user: null,
        root: false,
        instructor: false
      };
    }
  } catch (error) {
    return {
      user: null,
      root: false,
      instructor: false
    };
  }
});
export {
  load
};
