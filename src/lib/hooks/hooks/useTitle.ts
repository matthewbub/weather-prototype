import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

export function useTitle(title: string) {
	useIsomorphicLayoutEffect(() => {
		if (typeof title === "string" && title.trim().length > 0)
			document.title = title.trim();
	}, [title]);
}
