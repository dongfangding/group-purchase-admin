<script setup lang="ts" name="marketplaceComponent">
import { marketplaceGroupPageList, requestJoin } from "@/api/modules/master";
import { ref, watch, reactive } from "vue";
import dayjs from "dayjs";
import { FormInstance, ElMessage } from "element-plus";

const page = ref(1);
const dataSource = ref<any[]>([]);
const total = ref(0);
const dialogVisible = ref(false);
const currentRecord = ref<any>({});
const ruleFormRef = ref<FormInstance>();

watch(
	page,
	() => {
		marketplaceGroupPageList({ pageNum: page.value, pageSize: 20 } as any).then((res: any) => {
			dataSource.value = res.data?.content || [];
			total.value = res.total || 0;
		});
	},
	{ immediate: true }
);
const ruleForm = reactive({
	goodNum: 1
});
const rules = reactive({
	goodNum: [{ required: true, message: "请选择团购数量", trigger: "blur" }]
});
const srcList = [
	"https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
	"https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
	"https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg",
	"https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg",
	"https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg",
	"https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg",
	"https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg"
];

const handleJoin = (item: any) => {
	currentRecord.value = item;
	dialogVisible.value = true;
};

const handleConfirm = async () => {
	console.log("rule", ruleForm.goodNum);
	await ruleFormRef.value?.validate();
	await requestJoin({ groupId: currentRecord.value?.id, goodId: currentRecord.value?.goodId, goodNum: ruleForm.goodNum || 0 });
	ElMessage({
		message: "参团成功.",
		type: "success"
	});
	dialogVisible.value = false;
};

watch(dialogVisible, newVal => {
	if (!newVal) {
		currentRecord.value = {};
	}
});
</script>

<template>
	<div class="table-box">
		<div :style="{ overflow: 'auto', margin: '-8px' }">
			<div
				:style="{
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'space-between',
					maxWidth: '1200px',
					overflow: 'visible',
					padding: '8px'
				}"
			>
				<div v-for="item of dataSource" :key="item.id" :class="Classes['item-wrapper']">
					<div :class="Classes['item-group-master']">
						<div>
							<el-image :class="Classes['item-group-avatar-image']" :src="item.groupMasterAvatarUrl" />
						</div>
						<div :class="Classes['item-group-master-name']">
							{{ item.groupMasterName }}
						</div>
						<div>
							<div :class="Classes['item-group-join-info']">
								<span>100人跟团</span>
							</div>
							<div :class="Classes['item-group-join-info']">
								<span>1000人查看</span>
							</div>
						</div>
					</div>

					<div :class="Classes['item-title']">
						<!-- <el-tag :class="Classes['item-title-tag']" effect="plain" size="small">已隐藏</el-tag> -->
						<span>{{ item.name || "-" }}</span>
					</div>
					<div :class="Classes['item-time']">
						<span>起止时间：{{ dayjs(item.ctime * 1000).format("YYYY-MM-DD") }}</span>
						--
						<span>{{ dayjs(item.endTime * 1000).format("YYYY-MM-DD") }}</span>
					</div>
					<div :class="Classes['item-images']">
						<el-image
							v-for="(img, index) of srcList.slice(0, 3)"
							:key="img"
							:class="Classes['item-image']"
							:preview-src-list="srcList"
							:initial-index="index"
							:src="img"
						/>
					</div>
					<div :class="Classes['item-operate']">
						<div :class="Classes['item-operate-status']">{{ item.statusName }}</div>
						<div :class="Classes['item-operate-btns']">
							<el-button :class="Classes.btn" size="small" @click="$router.push({ name: 'Detail', params: { gid: item.id } })"
								>详情</el-button
							>
							<el-button :class="Classes.btn" size="small" @click="handleJoin(item)">参团</el-button>
						</div>
					</div>
					<el-divider :style="{ margin: '12px 0' }" />
					<div :class="Classes['item-descriptions']">
						<div :class="Classes['item-description']">
							<span :class="Classes['item-description-label']">实际收入</span
							><span :class="Classes['item-description-value']">￥0.00</span>
						</div>
						<div :class="Classes['item-description']">
							<span :class="Classes['item-description-label']">退款金额</span
							><span :class="Classes['item-description-value']">￥0</span>
						</div>
					</div>
					<div :class="Classes['item-descriptions']">
						<div :class="Classes['item-description']">
							<span :class="Classes['item-description-label']">已跟团</span
							><span :class="Classes['item-description-value']">0人/次</span>
						</div>
						<div :class="Classes['item-description']">
							<span :class="Classes['item-description-label']">取消跟团</span
							><span :class="Classes['item-description-value']">0人/次</span>
						</div>
						<div :class="Classes['item-description']">
							<span :class="Classes['item-description-label']">查看</span
							><span :class="Classes['item-description-value']">0人</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div :style="{ position: 'sticky', bottom: '-22px', textAlign: 'right', background: '#fff', marginRight: '-16px' }">
			<el-pagination layout="prev, pager, next" :total="total" @current-change="(p: number) => (page = p)" />
		</div>

		<el-dialog v-model="dialogVisible" :title="currentRecord.name" :width="360">
			<el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" status-icon>
				<el-form-item label="商品名称">
					<span>{{ currentRecord.goodName }}</span>
				</el-form-item>
				<el-form-item label="团购数量" prop="goodNum">
					<el-input-number v-model="ruleForm.goodNum" :min="1" :max="currentRecord.stock" />
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogVisible = false">取消</el-button>
					<el-button type="primary" @click="handleConfirm">确认</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<style module="Classes">
.item-wrapper {
	display: inline-block;
	width: 30%;
	padding: 8px;
	margin-bottom: 16px;
	background-color: white;
	border-radius: 8px;
	box-shadow: 1px 0 8px -1px rgb(0 0 0.5);
}
.item-group-master {
	display: flex;
	align-items: center;
	justify-content: center;
}
.item-group-master-name {
	flex: 1;
	margin-left: 5px;
}
.item-group-avatar-image {
	flex: 1;
	height: 50px;
	margin-right: 4px;
}
.item-group-join-info {
	font-size: 10px;
	color: gray;
}
.item-title {
	font-size: 18px;
	font-weight: 500;
	color: #000000;
}
.item-title-tag {
	margin-right: 6px;
	color: gray;
	vertical-align: middle;
	border-color: gray;
}
.item-time {
	margin-top: 8px;
	margin-bottom: 8px;
}
.item-time > span {
	font-size: 12px;
}
.item-images {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.item-image {
	flex: 1;
	height: 100px;
	margin-right: 4px;
}
.item-operate {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 10px;
	font-size: 14px;
}
.item-operate-status {
	flex: 1;
	color: #ff0000;
}
.item-operate-btns > .btn:nth-child(2) {
	background-color: lightgray;
	border: none;
}
.item-operate-btns > .btn:nth-child(1) {
	color: gray;
	border-color: gray;
}
.item-description {
	display: inline-block;
	margin-right: 10px;
	font-size: 12px;
	color: gray;
}
.item-description-value {
	margin-left: 6px;
}
</style>
