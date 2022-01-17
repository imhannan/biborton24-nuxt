<template>
	<main class="main-container">
		<ul
			class="
				grid grid-cols-1
				sm:grid-cols-2
				md:grid-cols-3
				lg:grid-cols-4
				gap-2
				md:gap-2
			"
		>
			<li
				v-for="post in posts"
				:key="post.id"
				class="
					flex flex-col
					border
					overflow-hidden
					shadow-md
					md:shadow-lg
					lg:shadow-xl
				"
			>
				<img :src="post.thumbnail" :alt="post.title" srcset="" />
				<nuxt-link
					:to="{
						name: 'posts-id-slug',
						params: { id: post.id, slug: post.slug },
					}"
					><h1 class="hover:text-blue-500 p-2 md:p-4">
						{{ post.title }}
					</h1></nuxt-link
				>
			</li>
		</ul>
		<ul class="flex flex-col items-center space-y-2 md:space-y-4">
			<li
				class="flex flex-col space-y-2 md:space-y-4"
				v-for="category in categories"
				:key="category.id"
			>
				<section class="bg-gray-200 p-4">
					{{ category.name }}
				</section>
				<ul
					class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4"
				>
					<li
						class="
							flex flex-col
							space-y-2
							md:space-y-4
							border
							shadow-md
							md:shadow-lg
							p-2
							md:p-4
						"
						v-for="post in category.posts"
						:key="post.id"
					>
						<img :src="post.thumbnail" :alt="post.title" />
						<nuxt-link
							:to="{
								name: 'posts-id-slug',
								params: { id: post.id, slug: post.slug },
							}"
							><h1 class="hover:text-blue-500">{{ post.title }}</h1></nuxt-link
						>
					</li>
				</ul>
			</li>
		</ul>
	</main>
</template>
<script setup>
	import { useStore } from "~~/store/main";
	const store = useStore();
	const posts = store.getPosts;
	const categories = store.getCategories;
	useMeta({
		title: "Home",
	});
</script>
