<script setup>
import { storeToRefs } from 'pinia';
import { ref } from "vue";
import { io } from "socket.io-client";
import { useAuthStore, useChatsStore } from '@/stores';
import { getTimeStr } from "@/helpers";

const authStore = useAuthStore();
const chatsStore = useChatsStore();
const { user } = storeToRefs(authStore);
const { users, messages } = storeToRefs(chatsStore);
const msg = ref('');
const chatEle = ref();

const serverUrl = `http://${import.meta.env.VITE_URL}`;
const socket = io(serverUrl);

chatsStore.setSocket(socket);
socket.on("connect", () => {
    socket.emit("joined", authStore.user.username);
});

socket.on("users", (data) => {
    chatsStore.setUsers(data);
});

socket.on("messages", (data) => {
    chatsStore.setMessages(data).then(() => {
        moveScrollbar();
    });
});

socket.on("new_user", (data) => {
    chatsStore.addUser(data);
});

socket.on("receive_message", (data) => {
    chatsStore.addMessage(data);
    moveScrollbar();
});

const moveScrollbar = () => {
    chatEle.value.scrollTop = chatEle.value.scrollHeight;
}

const onSubmit = () => {
    const text = msg.value.trim();
    if (text == "") return;
    msg.value = "";
    socket.emit("send_message", { username: authStore.user.username, message: text });
    chatsStore.addMessage({ username: authStore.user.username, message: text, createdAt: new Date().toString() }).then(() => {
        moveScrollbar();
    });
}

</script>

<template>
    <div v-if="user">
        <div class="container-fluid main">
            <div class="row">
                <div class="col-md-4 p-3">
                    <div class="users-group">
                        <div class="users-title">
                            Online Users
                        </div>
                        <div class="users-list">
                            <p v-for="u in users">{{ u }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-8 p-3">
                    <div class="chat-container">
                        <div class="chat-list" ref="chatEle">
                            <div v-for="m in messages" class="message-item" :class="m.username == user.username && 'sent'">
                                <div class="username" v-show="m.username != user.username">
                                    @{{ m.username }}
                                </div>
                                <div class="message">
                                    <div class="content">{{ m.message }}</div>
                                    <div class="timestamp">{{ getTimeStr(m.createdAt) }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="chat-box">
                            <input v-model="msg" v-on:keyup.enter="onSubmit" />
                            <button class="btn btn-primary" @click="onSubmit">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.main {
    height: calc(100vh - 58px);
}

.users-group {
    border: 1px solid rgb(83, 83, 83);

}

.users-title {
    padding: 16px;
    height: 60px;
    align-items: center;
    display: flex;
    font-size: 20px;
    font-weight: bold;
    background-color: rgb(98 162 225);
}

.users-list {
    padding: 16px;
    overflow-y: scroll;
    height: calc(100vh - 58px - 24px - 70px);
}

.users-list p {
    margin: 0;
    font-size: 16px;
    padding: 5px 0;
}

.chat-container {
    border: 1px solid rgb(83, 83, 83);
}

.chat-list {
    padding: 8px;
    overflow-y: scroll;
    height: calc(100vh - 58px - 24px - 50px);
}

@media (max-width: 767px) {
    .chat-list {
        height: calc((100vh - 58px) / 2 - 24px - 50px);
    }

    .users-list {

        height: calc((100vh - 58px) / 2 - 24px - 70px);
    }
}

.chat-box {
    border-top: 1px solid rgb(83, 83, 83);
    display: flex;
}

.chat-box input {
    border: none;
    flex: auto;
    padding-left: 10px;
    padding-right: 10px;
}

.chat-box input:focus-visible {
    outline: 0;
}

.chat-box button {
    border-radius: 0;
}

.message-item {
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
}

.sent {
    align-items: flex-end;
}

.sent .message {
    border-radius: 12px 12px 0px 12px;
}

.username {
    font-size: 12px;
    color: rgb(104, 104, 104)
}

.message {
    background-color: rgb(126 193 223);
    width: 300px;
    max-width: 80%;
    padding: 16px;
    border-radius: 12px 12px 12px 0px;
}

.content {
    word-wrap: break-word;
}

.timestamp {
    font-size: 12px;
    color: rgb(82, 82, 82);
    text-align: right;
}
</style>