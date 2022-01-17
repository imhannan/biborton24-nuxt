<template>
	<main class="grid place-items-center my-2 md:my-4 gap-2 md:gap-4">
		<h1>User Profile</h1>
		<transition name="fade">
			<div
				v-if="profile"
				class="border border-blue-500 p-4 flex flex-col space-y-2 md:space-y-4"
			>
				<section class="flex flex-col items-center space-y-2">
					<img
						:src="
							auth.user.photo
								? 'http://localhost:8000' + auth.user.photo
								: '/images/user.svg'
						"
						alt="Profile Photo"
						class="w-64 h-64 object-fill ring-2 ring-blue-500 rounded-full"
					/>
					<h1 class="text-center font-bold text-xl">{{ auth.user.name }}</h1>
				</section>
				<ul class="flex flex-col space-y-2" v-if="profile">
					<li>
						Full Name: {{ profile.firstName ?? "" }}
						{{ profile.lastName ?? "" }}
					</li>
					<li>Address: {{ profile.address ?? "" }}</li>
					<li>Birthday: {{ profile.birthday ?? "" }}</li>
					<li>Blood Group: {{ profile.bloodGroup ?? "" }}</li>
					<li>Mobile: {{ profile.phone ?? "" }}</li>
					<li>Education: {{ profile.education ?? "" }}</li>
				</ul>
				<section v-else>
					<p class="text-center">Please, create your profile</p>
				</section>
				<div class="flex justify-center">
					<nuxt-link
						:to="{ name: 'user-profile-id-update', params: { id: profile.id } }"
						class="btn btn-primary"
						>Update</nuxt-link
					>
				</div>
			</div>

			<div
				v-else
				class="border border-blue-500 p-4 flex flex-col space-y-2 md:space-y-4"
			>
				<section class="flex flex-col items-center">
					<img
						:src="selectedPhoto"
						alt="profile photo"
						class="w-64 h-64 rounded-full"
					/>
				</section>
				<form
					class="flex flex-col space-y-4"
					@submit.prevent="create"
					enctype="multipart/form-data"
				>
					<div class="form-group">
						<label for="photo">Select Profile Pic</label>
						<input
							type="file"
							class="form-control"
							id="photo"
							@change="onFileChange"
							accept="image/*"
						/>
					</div>
					<div class="form-group">
						<label for="firstName">First Name</label>
						<input
							type="text"
							class="form-control"
							id="firstName"
							placeholder="First Name"
							v-model="form.firstName"
							required
						/>
					</div>
					<div class="form-group">
						<label for="lastName">Last Name</label>
						<input
							type="text"
							class="form-control"
							id="lastName"
							placeholder="Last Name"
							v-model="form.lastName"
							required
						/>
					</div>
					<div class="form-group">
						<label for="birthday">Birthday</label>
						<input
							type="date"
							class="form-control"
							id="birthday"
							placeholder="Birthday"
							v-model="form.birthday"
						/>
					</div>
					<div class="form-group">
						<label for="bloodGroup">Blood Group</label>
						<select
							name="bloodGroup"
							id="bloodGroup"
							class="form-control"
							v-model="form.bloodGroup"
							required
						>
							<option value="A+">A+</option>
							<option value="A-">A-</option>
							<option value="B+">B+</option>
							<option value="B-">B-</option>
							<option value="AB+">AB+</option>
							<option value="AB-">AB-</option>
							<option value="O+">O+</option>
							<option value="O-">O-</option>
						</select>
					</div>
					<div class="form-group">
						<label for="phone">Mobile No.</label>
						<input
							type="text"
							class="form-control"
							id="phone"
							placeholder="Your Phone Number"
							v-model="form.phone"
						/>
					</div>
					<div class="form-group">
						<label for="education">Education Info.</label>
						<input
							type="text"
							class="form-control"
							id="education"
							placeholder="Your Education Info."
							v-model="form.education"
						/>
					</div>
					<div class="flex space-x-2 justify-center">
						<button type="submit" class="btn btn-primary">Save</button>
					</div>
				</form>
			</div>
		</transition>
	</main>
</template>

<script setup lang="ts">
	import { useAuthStore } from "~~/store/auth";
	const { $axios } = useNuxtApp();

	const auth = useAuthStore();
	const selectedPhoto = ref("/images/user.svg");
	const profile = computed(() => {
		return auth.user?.profile;
	});
	const form = reactive({
		photo: null,
		firstName: profile.value?.firstName ?? "",
		lastName: profile.value?.lastName ?? "",
		birthday: profile.value?.birthday ?? "",
		bloodGroup: profile.value?.bloodGroup ?? "",
		phone: profile.value?.phone ?? "",
		education: profile.value?.education ?? "",
	});

	async function onFileChange(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (file) {
			selectedPhoto.value = URL.createObjectURL(file);
			form.photo = file;
		}
	}

	async function create() {
		const formData = new FormData();
		formData.append("firstName", form.firstName);
		formData.append("lastName", form.lastName);
		formData.append("birthday", form.birthday);
		formData.append("bloodGroup", form.bloodGroup);
		formData.append("phone", form.phone);
		formData.append("education", form.education);
		if (form.photo) {
			formData.append("photo", form.photo);
		}

		try {
			const res = await $axios.post("/profiles", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			console.log(res.data);
			await auth.setCurrentUser();
		} catch (err) {
			console.error(err.message);
		}
	}

	useMeta({
		title: "Profile Page",
		meta: [
			{
				name: "description",
				content: "Profile Page",
			},
		],
	});
</script>

<style scoped>
	.fade-enter-active,
	.fade-leave-active {
		transition: all ease-in-out 0.3s;
	}

	.fade-enter-from,
	.fade-leave-to {
		transform: scaleY(0.3);
		opacity: 0.3;
	}
</style>