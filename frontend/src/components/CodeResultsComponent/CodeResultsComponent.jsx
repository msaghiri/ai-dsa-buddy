import style from "./CodeResultsComponent.module.css";
import icons from "../../assets/svg_icons.jsx";
import { useState } from "react";
/*

Result object:
{
    pass: boolean,
    expectedResult,
    result
}

*/

function PassResult() {
	const styles = `${style.result} ${style.pass}`;
	return <div className={styles}>{icons.check}</div>;
}

function FailResult({ result }) {
	const [expanded, setExpanded] = useState(false);
	const styles = `${style.result} ${style.fail} ${
		expanded ? style.expanded : ""
	}`;

	const handleExpansion = () => {
		setExpanded((e) => !e);
	};

	return (
		<div className={styles} onClick={handleExpansion}>
			{icons.fail}
			{expanded && (
				<div className={style.displayDiff}>
					<div className={style.expectedContainer}>
						<p>Expected:</p>
						<p className={style.expectedP}>
							{JSON.stringify(result.expectedResult)}
						</p>
					</div>
					<div className={style.outputContainer}>
						<p>Output: </p>
						<p className={style.outputP}>{JSON.stringify(result.result)}</p>
					</div>
				</div>
			)}
		</div>
	);
}

function Result({ result }) {
	return result.passed ? <PassResult /> : <FailResult result={result} />;
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
