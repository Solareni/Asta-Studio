import { useCallback, useEffect, useRef } from 'react';

export const useDynamicHeight = <T extends HTMLElement>(index: number, data: any, trigger: any) => {
	const rowRef = useRef<T>(null);

	const updateSize = useCallback(() => {
		if (rowRef.current) {
			const newHeight = rowRef.current.getBoundingClientRect().height;
			data.setSize(index, newHeight);
		}
	}, [index, data]);

	useEffect(() => {
		updateSize();
	}, [trigger, updateSize]);

	useEffect(() => {
		const handleResize = () => {
			updateSize();
		};
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [updateSize]);

	return rowRef;
};