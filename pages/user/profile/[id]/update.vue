<template>
	<main class="main-container">
		<div class="flex flex-col items-center space-y-2 md:space-y-4">
			<section class="flex justify-center" v-if="selectedPhoto">
				<img
					:src="selectedPhoto"
					alt="photo"
					class="w-64 h-64 rounded-full ring-2 ring-blue-500"
				/>
			</section>
			<form @submit.prevent="update" class="flex flex-col space-y-2 max-w-md">
				<div class="form-group">
					<label for="photo">Select Profile Pic</label>
					<input
						type="file"
						class="
							form-control
							file:bg-blue-500
							file:rounded-full
							file:text-white
							file:mr-4
							file:my-2
						"
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
	</main>
</template>

<script setup>
	import { useAuthStore } from "~~/store/auth";

	const { $axios } = useNuxtApp();
	const route = useRoute();
	const auth = useAuthStore();
	const selectedPhoto = ref("http://localhost:8000" + auth.user.photo);
	const profile = computed(() => {
		return auth.user.profile;
	});
	const photo = ref(null);

	const form = reactive({
		photo: null,
		firstName: profile.value?.firstName ?? "",
		lastName: profile.value?.lastName ?? "",
		birthday: profile.value?.birthday ?? "",
		bloodGroup: profile.value?.bloodGroup ?? "",
		phone: profile.value?.phone ?? "",
		education: profile.value?.education ?? "",
	});

	function onFileChange(e) {
		const file = e.target.files[0];
		if (file) {
			photo.value = file;
			selectedPhoto.value = URL.createObjectURL(file);
		}
	}

	async function update() {
		const formData = new FormData();
		formData.append("photo", photo.value);
		formData.append("firstName", form.firstName);
		formData.append("lastName", form.lastName);
		formData.append("birthday", form.birthday);
		formData.append("bloodGroup", form.bloodGroup);
		formData.append("phone", form.phone);
		formData.append("education", form.education);

		try {
			const res = await $axios.post(
				"/profiles/" + route.params.id + "/update",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			await auth.setCurrentUser();
			console.log(res.data);
		} catch (error) {
			console.log(error.message);
		}
	}

	useMeta({
		title: "Edit Profile",
	});
</script>

<style>
</style>