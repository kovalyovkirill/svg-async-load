import React, { useEffect, useState } from 'react';

interface UseDynamicSVGImportOptions {
    name: string;
    onCompleted: (svgProps: { props: React.SVGProps<SVGSVGElement> } | undefined) => void;
    onError?: (err: Error) => void;
}

export function useDynamicSVGImport({ name, onCompleted, onError }: UseDynamicSVGImportOptions) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error>();

    useEffect(() => {
        setLoading(true);
        const importIcon = async (): Promise<void> => {
            try {
                const isSvgImport = process.env.LIB_DEV || process.env.NODE_ENV === 'test';

                /** Используем асинхронный API импорт для того, чтобы загружать иконки в рантайме.
                 * В рантайме будет загружаться модуль который в себе сожержит функцию которая отрисует svg иконку.
                 * После сборки приложения мы получим js файлы с таким же названием как и svg.
                 * Поскольку мы не знаем какая иконка будет загружена для использования мы не можем оставить только svg импорт,
                 * поэтому нам необходимо условие по которому мы будем подгружать нужный вид иконки. Собранный js или оригинальный svg файл */
                const result = (await import(`./icons/${name}.${isSvgImport ? 'svg' : 'js'}`)).default;

                onCompleted(result);
            } catch (err) {
                const errorType = err as Error;

                onError?.(errorType);
                setError(errorType);

                console.error(errorType, `Ошибка загрузки иконки - ${name}`);
            } finally {
                setLoading(false);
            }
        };
        importIcon();
    }, [name, onCompleted, onError]);

    return { error, loading };
}
