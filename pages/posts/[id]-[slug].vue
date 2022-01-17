<template>
	<main class="main-container">
		<div class="flex flex-col space-y-2 md:space-y-4">
			<h1 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
				{{ post.data.title }}
			</h1>
			<div class="flex space-x-2 items-center">
				<h5>{{ post.data.author }}</h5>
				<span class="text-gray-400 text-sm">{{ post.data.created_at }}</span>
			</div>
			<p>{{ post.data.body }}</p>
		</div>
		<div class="flex flex-col space-y-2 md:space-y-4">
			<form
				v-if="auth.getAuthenticated"
				@submit.prevent="comment"
				class="flex flex-col space-y-2 md:space-y-4"
			>
				<div class="form-group">
					<label for="comment">Comment</label>
					<textarea
						v-model="form.body"
						name="comment"
						id="comment"
						class="form-control"
						required
					></textarea>
				</div>
				<div class="form-group">
					<button type="submit" class="btn btn-primary">Submit</button>
				</div>
			</form>
			<section>
				<ul class="flex flex-col space-y-2 md:space-y-4" v-if="comments.length">
					<li
						v-for="comment in comments"
						:key="comment.id"
						class="flex flex-col space-y-2"
					>
						<div class="flex space-x-2 md:space-x-4">
							<img
								:src="'http://localhost:8000' + comment.user.photo"
								:alt="comment.user.name"
								class="w-8 h-8 rounded-full"
							/>
							<h2 class="font-bold text-xl">{{ comment.user.name }}</h2>
						</div>
						<p class="px-4">{{ comment.body }}</p>
					</li>
				</ul>
				<span v-else class="text-center"> No comments yet. </span>
			</section>
		</div>
	</main>
</template>

<script setup lang="ts">
	import { useAuthStore } from "~~/store/auth";
	import { useNuxtApp, useRuntimeConfig } from "#app";
	const { $axios } = useNuxtApp();
	const config = useRuntimeConfig();
	const route = useRoute();
	const auth = useAuthStore();
	const form = reactive({
		body: "",
	});
	const { data: post } = await useFetch(`/posts/${route.params.id}`, {
		baseURL: config.baseURL,
	});

	const comments = ref(post.value.data.comments)

	async function comment() {
		if (form.body) {
			const data = {
				body: form.body,
			};

			try {
				const res = await $axios.post(`/posts/${route.params.id}/comments`, data);
				form.body = "";
				comments.value.push(res.data.data);
			} catch (err) {
				console.error(err.response.data);
			}
		}
	}

	async function fetchComments() {
		const res = await $axios.get(`/posts/${route.params.id}/comments`);
		comments.value = res.data.data;
	}

	useMeta({
		title: post.value.data.title,
		meta: [
			{
				name: "description",
				content: post.value.data.body,
			},
		],
	});
</script>

<style></style>
