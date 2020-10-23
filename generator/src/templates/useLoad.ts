/* eslint-disable */
import { useEffect, useRef, useState } from "react";

interface LoadASyncResponse<T> {
  response?: T;
  loading: boolean;
  error: boolean;
  errorMessage?: string;
  refresh: () => void;
}

interface UseLoadOptions<T> {
  load: () => Promise<T>;
  disabled?: boolean;
  callback?: (result: T) => void;
}

interface Storage<T> {
  response?: T;
  loading: boolean;
  error: boolean;
  errorMessage?: string;
}

function useLoad<T>(
  options: UseLoadOptions<T>,
  dependencies: Array<any>
): LoadASyncResponse<T> {
  const [storage, setStorage] = useState<Storage<T>>({
    response: undefined,
    loading: true,
    error: false,
    errorMessage: undefined,
  });
  const mounted = useRef(false);

  const load = async () => {
    if (!storage.loading) {
      setStorage({ ...storage, loading: true });
    }
    try {
      const getData = await options.load();
      if (mounted.current) {
        setStorage({
          error: false,
          errorMessage: undefined,
          response: getData,
          loading: false,
        });
        if (options.callback) {
          options.callback(getData as T);
        }
      }
    } catch (err) {
      if (mounted.current) {
        let errorMessage = err;
        if (err && err.message) {
          errorMessage = err.message;
        }
        setStorage({
          error: true,
          response: undefined,
          errorMessage,
          loading: false,
        });
      }
    }
  };

  useEffect(() => {
    mounted.current = true;
    if (!options.disabled) {
      load();
    }
    return () => {
      mounted.current = false;
    };
  }, [...dependencies, options.disabled]);

  return {
    error: storage.error,
    errorMessage: storage.errorMessage,
    refresh: load,
    response: storage.response,
    loading: options.disabled ? false : storage.loading,
  };
}
export default useLoad;
