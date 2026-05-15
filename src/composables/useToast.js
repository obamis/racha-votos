import { ref } from "vue";

const message = ref("");
const visible = ref(false);
let timer = null;

export function useToast() {
  function toast(msg, duration = 2800) {
    message.value = msg;
    visible.value = true;
    clearTimeout(timer);
    timer = setTimeout(() => { visible.value = false; }, duration);
  }
  return { message, visible, toast };
}
