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
			<h1 class="text-center font-bold text-lg md:text-2xl">User Register</h1>
			<form
				@submit.prevent="register"
				class="flex flex-col space-y-2 md:space-y-4"
			>
				<div class="form-group">
					<label for="name">Name</label>
					<input
						@blur="v$.name.$touch"
						type="text"
						class="form-control"
						id="name"
						v-model="form.name"
						placeholder="Your Name"
					/>
					<ul v-if="v$.name.$error" class="flex flex-col space-y-2">
						<li
							v-for="error of v$.name.$errors"
							:key="error.$uid"
							class="text-red-500"
						>
							{{ error.$message }}
						</li>
					</ul>
				</div>
				<div class="form-group">
					<label for="email">Email</label>
					<input
						@blur="v$.email.$touch"
						type="email"
						class="form-control"
						id="email"
						v-model="form.email"
						placeholder="Email"
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
						placeholder="Password"
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
				<div class="form-group">
					<label for="password_confirm">Confirm Password</label>
					<input
						@blur="v$.password_confirmation.$touch"
						type="password"
						class="form-control"
						id="password_confirm"
						v-model="form.password_confirmation"
						placeholder="Confirm Password"
					/>
					<ul
						v-if="v$.password_confirmation.$error"
						class="flex flex-col space-y-2"
					>
						<li
							v-for="error of v$.password_confirmation.$errors"
							:key="error.$uid"
							class="text-red-500"
						>
							{{ error.$message }}
						</li>
					</ul>
				</div>
				<button type="submit" class="btn btn-primary">Register</button>
			</form>
		</div>
	</main>
</template>

<script setup lang="ts">
	import { useAuthStore } from "~~/store/auth";
	import useVuelidate from "@vuelidate/core";
	import { required, email, minLength, sameAs } from "@vuelidate/validators";
	const auth = useAuthStore();
	const router = useRouter();
	const token = useCookie("token");
	const form = reactive({
		name: "",
		email: "",
		password: "",
		password_confirmation: "",
	});

	const rules = computed(() => ({
		name: { required },
		email: { required, email },
		password: { required, minLength: minLength(8) },
		password_confirmation: { required, sameAs: sameAs(form.password) },
	}));

	const v$ = useVuelidate(rules, form);

	async function register() {
		const user = {
			name: form.name,
			email: form.email,
			password: form.password,
			password_confirmation: form.password_confirmation,
		};

		const isFormValid = await v$.value.$validate();

		if (isFormValid) {
			const response = await auth.register(user);
			if (response) {
				router.push("/");
			} else {
				console.log("error: registration failed");
			}
		}
	}

	useMeta({
		title: "User Register",
	});
</script>

<style>
</style>