import Hero from "../components/HomeSections/Hero";
import Features from "../components/HomeSections/Features";

export default function HomePage() {

	return (
		<div className=" bg-background text-text dark:bg-backgroundDark dark:text-textDark">
			<Hero />
			<div className="container mx-auto">
				<Features />
			</div>
		</div>
	);
}
