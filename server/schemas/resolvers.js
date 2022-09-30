const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    getSingleUser: async (parent, { params }) => {
      return User.findOne({
        $or: [
          { _id: user ? user._id : params.id },
          { username: params.username },
        ],
      })
        .select("-__v -password")
        .populate("savedBooks");
    },
  },

  Mutation: {
    createUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ username: email });
      if (!user) {
        return res.status(400).json({ message: "Can't find this user" });
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, args, context) => {
      console.log(" args ", args, " context ", context);

      if (context.user) {
        try {
          const updateUser = await User.findOneAndUpdate(
            { _id: user._id },
            { $addToSet: { savedBooks: args } },
            { new: true, runValidators: true }
          );
          return res.json(updatedUser);
        } catch (err) {
          console.log(err);
          return res.status(400).json(err);
        }
      }

      throw new AuthenticationError("You need to be logged in!");
    },
    deleteBook: async (parent, args, context, info) => {
      if (context.user) {
        await Book.findOneAndRemove({ bookId: args.bookId });
        const currBooks = await User.find({ username: context.user.username });
        return currBooks;
      }

      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
