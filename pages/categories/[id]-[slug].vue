<template>
	<main class="main-container">
		<div class="flex flex-col space-y-2 md:space-y-4">
			<h1
				class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center"
			>
				{{ data.category.name }}
			</h1>
			<ul
				class="
					grid grid-cols-1
					sm:grid-cols-2
					md:grid-cols-3
					lg:grid-cols-4
					gap-1
					sm:gap-2
					md:gap-3
					lg:gap-4
				"
			>
				<li
					v-for="post in data.posts"
					:key="post.id"
					class="
						border
						shadow-md
						md:shadow-lg
						overflow-hidden
						lg:first:col-span-2 lg:first:row-span-2
					"
				>
					<img :src="post.thumbnail" :alt="post.title" />
					<nuxt-link
						:to="{
							name: 'posts-id-slug',
							params: { id: post.id, slug: post.slug },
						}"
						class="hover:text-blue-500 block p-2"
					>
						{{ post.title }}
					</nuxt-link>
				</li>
			</ul>
		</div>
		<div class="flex justify-center space-x-2">
			<div v-for="link in data.links" :key="link.url + link.label">
				<button
					@click="fetchPost(link.url)"
					class="btn btn-secondary"
					:class="{
						'pagination-active': link.active || !link.url,
					}"
				>
					{{ removeHtmlCharacters(link.label) }}
				</button>
			</div>
		</div>
	</main>
</template>

<script setup lang="ts">
	import { useRuntimeConfig, useNuxtApp } from "#app";
	const config = useRuntimeConfig();
	const { $axios } = useNuxtApp();
	const route = useRoute();

	interface Data {
		category: {
			id: number;
			name: string;
		};

		posts: {
			id: number;
			title: string;
			slug: string;
			thumbnail: string;
		}[];

		links: { url: string; label: string; active: boolean }[];
		currentUrl: string;
	}

	const data: Data = reactive({
		category: {
			id: 0,
			name: "",
		},
		posts: [],
		links: [],
		currentUrl: config.baseURL,
	});

	try {
		if (!route.query.page) {
			const res = await useFetch(`/categories/${route.params.id}/posts`, {
				baseURL: config.baseURL,
			});
			data.posts = res.data.value.posts.data;
			data.category = res.data.value.category;
			data.links = res.data.value.posts.links;
		} else {
			const res = await useFetch(
				`/categories/${route.params.id}/posts?page=${route.query.page}`,
				{
					baseURL: config.baseURL,
				}
			);
			data.posts = res.data.value.posts.data;
			data.category = res.data.value.category;
			data.links = res.data.value.posts.links;
		}
	} catch (error) {
		console.log(error);
	}

	async function fetchPost(url: string) {
		try {
			const res = await $axios.get(url);
			data.posts = res.data.posts.data;
			data.links = res.data.posts.links;
		} catch (error) {
			console.error(error);
		}
	}

	function getPage(url: string): string {
		// const page = url.split("page=")[1];
		// return page ? page : "1";
		return url.split("page=")[1] || "1";
	}

	function removeHtmlCharacters(str: string): string {
		return str
			.replaceAll(/&amp;/g, "&")
			.replaceAll(/&lt;/g, "<")
			.replaceAll(/&gt;/g, ">")
			.replaceAll(/&\w+;/g, "");
	}

	useMeta({
		title: data.category.name,
	});
</script>

<style>
</style>