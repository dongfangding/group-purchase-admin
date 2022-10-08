<template>
	<div>
		<JwChat
			:taleList="list"
			@enter="bindEnter"
			@clickTalk="talkEvent"
			v-model="inputMsg"
			:toolConfig="tool"
			:quickList="quickList"
		>
			<template #tools>
				<div style="width: 20rem; text-align: right" @click="toolEvent('自定义', '参数2')">
					<b>插槽{{ tool }}</b>
					<JwChat-icon type="icon-lishi" title="自定义" />
				</div>
			</template>
		</JwChat>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue";
// import Chat from "@/components/chat/Chat/index.vue";
import dayjs from "dayjs";
import useMqtt from "@/utils/useMqtt";
import { GlobalStore } from "@/store";
const globalStore = GlobalStore();
const { subscribe, unsubscribe } = useMqtt();

const inputMsg = ref("");
const list = ref<any>([]);
const data = reactive({
	list: [] as any
});
const toolEvent = (type: any, obj: any) => {
	console.log("tools", type, obj);
};
const talkEvent = (play: any) => {
	console.log(play);
};
const tool = ref({
	show: ["file", "history", "img", ["文件1", "", "美图"]], // 二级数组中放自定义名称
	showEmoji: true,
	callback: toolEvent(1, 2)
});
const quickList = ref([
	{ text: "这里是jwchat,您想了解什么问题。" },
	{ text: "jwchat是最好的聊天组件" },
	{ text: "谁将烟焚散，散了纵横的牵绊；听弦断，断那三千痴缠。" },
	{ text: "长夏逝去。山野间的初秋悄然涉足。" },
	{ text: "江南风骨，天水成碧，天教心愿与身违。" },
	{ text: "总在不经意的年生。回首彼岸。纵然发现光景绵长。" },
	{ text: "外面的烟花奋力的燃着，屋里的人激情的说着情话" },
	{ text: "假如你是云，我就是雨，一生相伴，风风雨雨；" },
	{ text: "即使泪水在眼中打转，我依旧可以笑的很美，这是你学不来的坚强。" },
	{ text: " 因为不知来生来世会不会遇到你，所以今生今世我会加倍爱你。" }
]);

// const config = ref({
// 	historyConfig: {
// 		show: true,
// 		tip: "滚动到顶时候显示的提示"
// 	}
// });

onMounted(() => {
	const img = "https://www.baidu.com/img/flexible/logo/pc/result.png";
	const list = [
		{
			date: "2020/04/25 21:19:07",
			text: { text: "起床不" },
			mine: false,
			name: "留恋人间不羡仙",
			img: "https://www.snowball.fans/group1/M00/00/00/ag8Kh2MIQSuAbTBzAABV_CaBEOo06.jpeg"
		},
		{
			date: "2020/04/25 21:19:07",
			text: { text: "<audio data-src='https://www.w3school.com.cn/i/horse.mp3'/>" },
			mine: false,
			name: "只盼流星不盼雨",
			img: "https://www.snowball.fans/group1/M00/00/00/ag8Kh2MIQSuAbTBzAABV_CaBEOo06.jpeg"
		},
		{
			date: "2020/04/25 21:19:07",
			text: { text: "<img data-src='" + img + "'/>" },
			mine: false,
			name: "只盼流星不盼雨",
			img: "https://www.snowball.fans/group1/M00/00/00/ag8Kh2MIQSuAbTBzAABV_CaBEOo06.jpeg"
		},
		{
			date: "2020/04/25 21:19:07",
			text: { text: "<img data-src='https://www.snowball.fans/group1/M00/00/00/ag8Kh2MIQSuAbTBzAABV_CaBEOo06.jpeg'/>" },
			mine: false,
			name: "只盼流星不盼雨",
			img: "https://www.snowball.fans/group1/M00/00/00/ag8Kh2MIQSuAbTBzAABV_CaBEOo06.jpeg"
		},
		{
			date: "2020/04/16 21:19:07",
			text: { text: "<video data-src='https://www.w3school.com.cn/i/movie.mp4' controls='controls' />" },
			mine: true,
			name: "JwChat",
			img: "https://www.snowball.fans/group1/M00/00/00/ag8Kh2MIQSuAbTBzAABV_CaBEOo06.jpeg"
		},
		{
			date: "2021/03/02 13:14:21",
			mine: false,
			name: "留恋人间不羡仙",
			img: "https://www.snowball.fans/group1/M00/00/00/ag8Kh2MIQSuAbTBzAABV_CaBEOo06.jpeg",
			text: {
				system: {
					title: "在接入人工前，智能助手将为您首次应答。",
					subtitle: "猜您想问:",
					content: [
						{
							id: `system1`,
							text: "组件如何使用"
						},
						{
							id: `system2`,
							text: "组件参数在哪里查看"
						},
						{
							id: "system",
							text: "我可不可把组件用在商业"
						}
					]
				}
			}
		},
		{
			date: "2020/04/25 21:19:07",
			text: {
				text: "<i class='el-icon-document-checked' style='font-size:2rem;'/>",
				subLink: {
					text: "a.txt",
					prop: {
						underline: false
					}
				}
			},
			mine: false,
			name: "留恋人间不羡仙",
			img: "https://www.snowball.fans/group1/M00/00/00/ag8Kh2MIQSuAbTBzAABV_CaBEOo06.jpeg"
		},
		{
			date: "2020/04/25 21:19:07",
			mine: false,
			name: "留恋人间不羡仙",
			img: "https://www.snowball.fans/group1/M00/00/00/ag8Kh2MIQSuAbTBzAABV_CaBEOo06.jpeg",
			text: {
				shop: {
					title: `2022年寒假读一本好书小学生三四五六年级课外读
								物阅读书籍经典儿童文学 回到远古和神仙们聊天 王云超著`,
					describe: "购买1-3件时享受单件价￥18.20，超出数量以结算价为准，仅限购买一次:",
					price: "999.99",
					cover: "https://www.snowball.fans/group1/M00/00/00/ag8Kh2MIQSuAbTBzAABV_CaBEOo06.jpeg",
					tags: [{ name: "第二件半价" }, { name: "送50元优惠" }, { name: "满1件,送50元优惠" }]
				}
			}
		}
	];
	data.list = [...list];
});
onUnmounted(() => {
	// 页面销毁结束订阅
	unsubscribe("/#");
});
subscribe("/#", (topic, message) => {
	const msg = JSON.parse(message.toString());
	const msgObj = {
		date: dayjs().format("YYYY/MM/DD HH:mm:ss"),
		text: { text: msg },
		mine: false,
		name: "收到的消息",
		img: "https://www.snowball.fans/group1/M00/00/00/ag8Kh2MIQSuAbTBzAABV_CaBEOo06.jpeg"
	};
	list.value.push(msgObj);
	console.log(msgObj);
});
const bindEnter = (e: any) => {
	inputMsg.value = e;
	console.log("bindEnter", e);
	const msg = inputMsg.value;
	console.log("bindEnter", msg);
	if (!msg) return;
	const msgObj = {
		date: dayjs().format("YYYY/MM/DD HH:mm:ss"),
		text: { text: msg },
		mine: true,
		name: globalStore.userInfo.nickname,
		img: "https://www.snowball.fans/group1/M00/00/00/ag8Kh2MIQSuAbTBzAABV_CaBEOo06.jpeg"
	} as any;
	list.value.push(msgObj);
};
</script>
