<template>
	<main class="main-container items-center">
		<div
			class="
				flex flex-col
				justify-between
				w-full
				sm:w-5/6
				md:w-4/6
				lg:w-1/2
				xl:w-1/3
				space-y-2
				md:space-y-4
			"
		>
			<h1 class="text-xl md:text-2xl font-bold text-center">User Login</h1>
			<form
				@submit.prevent="login"
				class="flex flex-col space-y-2 md:space-y-4"
			>
				<div class="form-group">
					<label for="email">Email</label>
					<input
						@blur="v$.email.$touch"
						type="email"
						class="form-control"
						id="email"
						v-model="form.email"
					/>
					<ul v-if="v$.email.$error" class="flex flex-col space-y-2">
						<li
							v-for="error of v$.email.$errors"
							:key="error.$uid"
							class="text-red-500"
						>
							{{ error.$message }}
						</li>
					</ul>
				</div>
				<div class="form-group">
					<label for="password">Password</label>
					<input
						@blur="v$.password.$touch"
						type="password"
						class="form-control"
						id="password"
						v-model="form.password"
					/>
					<ul v-if="v$.password.$error" class="flex flex-col space-y-2">
						<li
							v-for="error of v$.password.$errors"
							:key="error.$uid"
							class="text-red-500"
						>
							{{ error.$message }}
						</li>
					</ul>
				</div>
				<button type="submit" class="btn btn-primary">Login</button>
			</form>
		</div>
	</main>
</template>

<script setup lang="ts">
	import { useAuthStore } from "~~/store/auth";
	import useVuelidate from "@vuelidate/core";
	import { required, email } from "@vuelidate/validators";
	const router = useRouter();
	const auth = useAuthStore();
	const token = useCookie("token");
	const config = useRuntimeConfig();
	const form = reactive({
		email: "",
		password: "",
	});

	const rules = computed(() => ({
		email: { required, email },
		password: { required },
	}));
	const v$ = useVuelidate(rules, form);

	async function login() {
		const isFormValid = await v$.value.$validate();
		if (isFormValid) {
			const user = {
				email: form.email,
				password: form.password,
			};
			
			const response = await auth.login(user);
			if (response) {
				router.push("/");
			} else {
				console.error("Login failed");
			}
		}
	}

	useMeta({
		title: "User Login",
		meta: [
			{
				name: "description",
				content: "User Login",
			},
		],
	});
</script>

<style>
</style>