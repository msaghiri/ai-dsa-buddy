import style from "./CodeResultsComponent.module.css";
import icons from "../../assets/svg_icons.jsx";

/*

Result object:
{
    pass: boolean,
    expectedResult,
    result
}

*/

function Result({ result }) {
	const styles = `${style.result} ${result.pass ? style.pass : style.fail}`;
	return (
		<div className={styles}>
			{result.pass && icons.check}
			{!result.pass && icons.fail}

			{!result.pass && (
				<div className={style.displayDiff}>
					<p className={style.userRes}>{result.result}</p>
					<p className={style.expected}>{result.expectedResult}</p>
				</div>
			)}
		</div>
	);
}

function CodeResultsComponent({ results }) {
	return (
		<div className={style.codeResultsContainer}>
			{results.map((result, index) => (
				<Result result={result} />
			))}
		</div>
	);
}

export default CodeResultsComponent;
