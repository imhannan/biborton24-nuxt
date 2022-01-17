<template>
	<div>
		<header
			class="
				flex
				justify-between
				items-center
				p-4
				bg-blue-500
				shadow-md
				md:shadow-none
				sticky
				top-0
				left-0
				right-0
				md:relative
			"
		>
			<div class="flex items-center space-x-2 md:space-x-4">
				<svg
					aria-hidden="true"
					focusable="true"
					data-prefix="fas"
					data-icon="bars"
					class="h-8 w-8 text-white md:hidden"
					role="img"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 448 512"
					@click="toggleMenu"
				>
					<path
						fill="currentColor"
						d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"
					></path>
				</svg>
				<nuxt-link :to="{ path: '/' }" class="text-xl text-white font-bold"
					>Biborton24</nuxt-link
				>
			</div>

			<div class="flex items-center space-x-2 md:space-x-4">
				<nuxt-link :to="{ name: 'user-login' }" v-if="!auth.isAuthenticated">
					<button
						class="
							p-2
							cursor-pointer
							rounded-md
							hover:bg-white hover:text-blue-500
							text-white
							border border-white
							duration-300
						"
					>
						Login
					</button>
				</nuxt-link>
				<nuxt-link :to="{ name: 'user-register' }" v-if="!auth.isAuthenticated">
					<button
						class="
							p-2
							cursor-pointer
							rounded-md
							hover:bg-white hover:text-blue-500
							text-white
							border border-white
							duration-300
						"
					>
						Register
					</button>
				</nuxt-link>

				<button
					@click="toggleProfile"
					v-if="auth.isAuthenticated"
					class="
						p-1
						cursor-pointer
						rounded-full
						hover:bg-white hover:text-blue-500
						text-white
						border border-white
						duration-300
					"
				>
					<img
						:src="'http://localhost:8000' + auth?.user?.photo"
						:alt="auth.user?.name"
						class="h-8 w-8 rounded-full"
					/>
				</button>
			</div>
		</header>
		<section
			v-if="profileIsOpen && auth.isAuthenticated"
			class="fixed top-15 right-0 z-10 p-4 bg-white flex flex-col space-y-2"
		>
			<button @click="pushToProfile" class="btn btn-secondary">Profile</button>
			<button @click="logout" class="btn btn-secondary">Logout</button>
		</section>
		<nav
			class="
				hidden
				sticky
				top-0
				left-0
				right-0
				bg-gray-200
				p-4
				shadow-md
				md:shadow-lg
				lg:shadow-xl
				md:block
			"
		>
			<ul class="flex justify-center items-center space-x-2 md:space-x-4">
				<li
					v-for="category in categories.data"
					:key="category.id"
					class="group"
				>
					<nuxt-link
						:to="{
							name: 'categories-id-slug',
							params: { id: category.id, slug: category.slug },
						}"
						class="
							p-2
							bg-white
							rounded-md
							group-hover:bg-blue-500 group-hover:text-white
							duration-300
						"
					>
						{{ category.name }}
					</nuxt-link>
				</li>
			</ul>
		</nav>
		<transition name="modal">
			<aside
				v-if="sidebarIsOpen"
				class="modal fixed top-0 left-0 h-screen w-screen flex"
			>
				<div
					class="
						bg-white
						h-full
						p-2
						sm:p-4
						flex flex-col
						space-y-2
						md:space-y-4
					"
				>
					<h1
						class="
							text-lg
							md:text-xl
							lg:text-2xl
							text-black
							font-bold
							border-b
							pb-2
						"
					>
						Biborton24
					</h1>
					<ul class="flex flex-col space-y-2">
						<li v-for="category in categories.data" :key="category.id">
							<nuxt-link
								:to="{
									name: 'categories-id-slug',
									params: { id: category.id, slug: category.slug },
								}"
								class="hover:text-blue-500"
							>
								{{ category.name }}
							</nuxt-link>
						</li>
					</ul>
					<button
						@click="toggleMenu"
						class="
							p-2
							text-center
							border border-blue-500
							rounded-md
							hover:bg-blue-500 hover:text-white
							duration-300
						"
					>
						Close
					</button>
				</div>
			</aside>
		</transition>
		<slot />
		<footer class="text-center p-4 bg-gray-200">&copy; biborton24</footer>
	</div>
</template>
<script setup lang="ts">
	import { useAuthStore } from "~~/store/auth";
	import { useStore } from "../store/main";
	import { useRuntimeConfig } from "#app";
	const config = useRuntimeConfig();
	const store = useStore();
	const router = useRouter();
	const auth = useAuthStore();
	const sidebarIsOpen = ref(false);
	const profileIsOpen = ref(false);

	await auth.setCurrentUser();

	const { data: posts } = await useFetch("/posts", { baseURL: config.baseURL });
	const { data: categories } = await useFetch("/categories", {
		baseURL: config.baseURL,
	});
	store.setPosts(posts.value.data);
	store.setCategories(categories.value.data);

	function toggleMenu() {
		sidebarIsOpen.value = !sidebarIsOpen.value;
	}

	function toggleProfile() {
		profileIsOpen.value = !profileIsOpen.value;
	}

	function pushToProfile() {
		router.push({
			name: "user-profile",
		});
		profileIsOpen.value = false;
	}

	async function logout() {
		const res = await auth.logout();
		if (res) {
			profileIsOpen.value = false;
			router.push("/");
		} else {
			console.log("error");
		}
	}
</script>
<style scoped>
	.modal {
		background: rgba(0, 0, 0, 0.4);
	}
	.modal-enter-active {
		animation: fade-in 0.3s ease-in;
	}
	.modal-leave-active {
		animation: fade-out 0.3s ease-out;
	}

	@keyframes fade-in {
		0% {
			opacity: 0.5;
			transform: translateX(-100%);
		}
		50% {
			opacity: 0.7;
			transform: translateX(-50%);
		}
		100% {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes fade-out {
		0% {
			opacity: 1;
			transform: translateX(0);
		}
		50% {
			opacity: 0.7;
			transform: translateX(-50%);
		}
		100% {
			opacity: 0.5;
			transform: translateX(-100%);
		}
	}
</style>