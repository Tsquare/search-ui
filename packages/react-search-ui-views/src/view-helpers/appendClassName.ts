function getNewClassName(newClassName: string | string[]) {
  if (!Array.isArray(newClassName)) return newClassName;

  return newClassName.filter((name) => name).join(" ");
}

export default function appendClassName(
  baseClassName?: string | string[] | undefined | null,
  newClassName?: string | string[] | undefined | null
): string {
  if (!newClassName)
    return (
      (Array.isArray(baseClassName)
        ? baseClassName.join(" ")
        : baseClassName) || ""
    );
  if (!baseClassName) return getNewClassName(newClassName) || "";
  return `${baseClassName} ${getNewClassName(newClassName)}`;
}
