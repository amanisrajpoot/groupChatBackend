const ROLE = {
  ADMIN: "admin",
  EDITOR: "editor",
  BASIC: "basic",
};

module.exports = {
  ROLE: ROLE,
  users: [
    {
      id: 1,
      name: "Aman",
      password: "$2b$10$042WTW1oPRnrJbqVMHptaugDWFzVB00fyL.oehdSSLsGEhYQzWjSW",
      role: "admin",
    },
    {
      id: 2,
      name: "Abhay",
      password: "$2b$10$CxwAXVclDeaiEpWp7pnr6eK8PUWjWgjCFFmNxtqBNp9JM0DIcoIQK",
      role: "editor",
    },
    {
      id: 3,
      name: "Priyata",
      password: "$2b$10$FI3vKTeWALRi6SHkNDXfh.39nOMsM4reHOZ7uNhKfLS/Dblt.va2q",
      role: "basic",
    },
  ],
  projects: [
    { id: 1, name: "Aman's Project", userId: 1 },
    { id: 2, name: "Abhay's Project", userId: 2 },
    { id: 3, name: "Priyata's Project", userId: 3 },
    { id: 4, name: "Aman's Project", userId: 4 },
    { id: 5, name: "Aman's Project", userId: 5 },
  ],
  rooms: [
    {
      id: 1,
      name: "group1",
      members: ["Aman", "Abhay", "Priyata"],
      createdBy: "Aman",
      admins: ["Aman"],
      messages: [
        {
          body: "Hello, how's everyone doing?",
          sentBy: "Aman",
          sentAt: "2023-10-22T12:34:56Z",
          reactionBy: [],
        },
        {
          body: "Hello, how's everyone doing?",
          sentBy: "Abhay",
          sentAt: "2023-10-22T12:34:56Z",
          reactionBy: [],
        },
        {
          body: "Hello, how's everyone doing?",
          sentBy: "Priyata",
          sentAt: "2023-10-22T12:34:56Z",
          reactionBy: [],
        },
      ],
    },

    {
      id: 2,
      name: "group1",
      members: ["Aman", "Abhay", "Priyata"],
      createdBy: "Aman",
      admins: ["Aman"],
      messages: [
        {
          body: "Hello, how's everyone doing?",
          sentBy: "Aman",
          sentAt: "2023-10-22T12:34:56Z",
          reactionBy: [],
        },
        {
          body: "Hello, how's everyone doing?",
          sentBy: "Abhay",
          sentAt: "2023-10-22T12:34:56Z",
          reactionBy: [],
        },
        {
          body: "Hello, how's everyone doing?",
          sentBy: "Priyata",
          sentAt: "2023-10-22T12:34:56Z",
          reactionBy: [],
        },
      ],
    },
    {
      id: 3,
      name: "group1",
      members: ["Aman", "Abhay", "Priyata"],
      createdBy: "Aman",
      admins: ["Aman"],
      messages: [
        {
          body: "Hello, how's everyone doing?",
          sentBy: "Aman",
          sentAt: "2023-10-22T12:34:56Z",
          reactionBy: [],
        },
        {
          body: "Hello, how's everyone doing?",
          sentBy: "Abhay",
          sentAt: "2023-10-22T12:34:56Z",
          reactionBy: [],
        },
        {
          body: "Hello, how's everyone doing?",
          sentBy: "Priyata",
          sentAt: "2023-10-22T12:34:56Z",
          reactionBy: [],
        },
      ],
    },
  ],
};
