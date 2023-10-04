import { defineStore } from "pinia";

export const useChatsStore = defineStore({
  id: "chats",
  state: () => ({
    messages: [],
    users: [],
    socket: null,
  }),
  actions: {
    setUsers(data) {
      this.users = [...data];
    },
    setSocket(sock) {
      this.socket = sock;
    },
    setMessages(data) {
      this.messages = [...data];
      return Promise.resolve();
    },
    addUser(data) {
      this.users = [...this.users, data];
    },
    addMessage(data) {
      this.messages = [...this.messages, data];
      return Promise.resolve();
    },
  },
});
