<script lang="ts">
	const api_key = import.meta.env.VITE_WEATHER_KEY;
	const api_url = import.meta.env.VITE_WEATHER_BASE_URL;

	import axios from 'axios';
	import Footer from '../footer.svelte';

	let errors = { search: '' };
	let data = { search: '', error: false };
	let weatherdata: any = '';
	let bgImage = 'url(https://picsum.photos/1600/1200)';
	let bgClass = '';

	$: bgClass = bgImage ? 'hero min-h-screen' : 'hero min-h-screen bg-base-200';

	const getCityData = async (city: string) => {
		try {
			const res = await axios.get(`${api_url}/current.json?key=${api_key}&q=${city}&aqi=no`);
			data.error = false;
			return res.data;
		} catch (e) {
			data.error = true;
		}
	};

	function isRequired(value: string | null) {
		return value != null && value !== '';
	}

	function checkMinMaxLength(value: string) {
		return value.length < 3 || value.length > 50 ? true : false;
	}

	const submitForm = async (event: any) => {
		const searchValue: any = new FormData(event.target);
		let error = false;
		weatherdata = '';

		for (let field of searchValue) {
			const [key, value] = field;
			if (!isRequired(value)) {
				errors.search = 'Please Enter Your Location.';
				error = true;
			}
			if (isRequired(value) && checkMinMaxLength(value)) {
				errors.search = 'Min 3 characters required';
				error = true;
			}
		}

		if (!error) {
			errors.search = '';
			weatherdata = await getCityData(data.search);
		}

		data.search = '';
	};
</script>

<svelte:head>
	<title>Weather App | By Prince K</title>
	<meta charset="UTF-8" />
	<meta name="robots" content="noindex nofollow" />
	<meta name="description" content="Weather App created with svelte" />
	<meta name="keywords" content="Prince K, Prince, Svelte, Weather, App" />
	<meta name="author" content="Prince K" />
	<html lang="en" />
</svelte:head>

<div class={bgClass} style:background-image={bgImage}>
	{#if bgImage}
		<div class="hero-overlay bg-opacity-50" />
	{/if}
	<div class="hero-content text-center rounded-lg backdrop-blur-lg shadow-2xl">
		<div class="max-w-xl">
			<h1 class="text-5xl my-6 font-bold text-base-200">Weather App</h1>
			<div class="form-control w-full">
				{#if errors.search}
					<div class="alert alert-error shadow-lg alert-sm text-sm">
						<div>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="stroke-current flex-shrink-0 h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
								/></svg
							>
							<span>{errors.search}</span>
						</div>
					</div>
				{/if}
				<form on:submit|preventDefault={submitForm}>
					<label class="label" for="search">
						<span class="label-text text-base-200">Search Your Location</span>
					</label>
					<input
						id="search"
						type="text"
						name="search"
						placeholder="Type here"
						class="input input-bordered w-full"
						bind:value={data.search}
					/>
					<button type="submit" class="btn btn-block my-6">Get Weather Data</button>
				</form>
			</div>
			{#if weatherdata && !errors.search && !data.error}
				<div class="stack my-4 text-base-200">
					<div class="text-center shadow-md w-full card">
						<div class="card-body">
							<h2 class="card-title">
								<span>
									<!-- svelte-ignore a11y-img-redundant-alt -->
									<img src={weatherdata.current.condition.icon} alt="cloud-image" class="rounded" />
								</span>
								{weatherdata.location.name}, {weatherdata.location.country}
							</h2>
							<p>
								<span class="text-5xl font-bold">{weatherdata.current.temp_c}&#176;C</span>
								<i class="text-sm">feels like </i><span class="font-semibold"
									>{weatherdata.current.feelslike_c}&#176;C</span
								>
							</p>
							<p class="font-bold text-xl">{weatherdata.current.condition.text}</p>
							<p class="text-xs">{weatherdata.location.localtime}</p>
						</div>
					</div>
					<div class="text-center shadow w-36 card">
						<div class="card-body" />
					</div>
					<div class="text-center shadow-sm w-36 card">
						<div class="card-body" />
					</div>
				</div>
				<div
					class="stats stats-vertical lg:stats-horizontal text-base-200 shadow-lg bg-transparent"
				>
					<div class="stat">
						<div class="stat-title">Wind</div>
						<div class="stat-value">{weatherdata.current.wind_kph} kph</div>
					</div>

					<div class="stat">
						<div class="stat-title">Humidity</div>
						<div class="stat-value">{weatherdata.current.humidity} %</div>
					</div>

					<div class="stat">
						<div class="stat-title">Visibility</div>
						<div class="stat-value">{weatherdata.current.vis_km} km</div>
					</div>
				</div>
			{:else if data.error && !errors.search}
				<div class="alert shadow-lg">
					<div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							class="stroke-info flex-shrink-0 w-6 h-6"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/></svg
						>
						<span>Sorry! we can search only on earth</span>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<Footer />
