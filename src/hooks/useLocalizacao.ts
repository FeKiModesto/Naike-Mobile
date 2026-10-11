import { useCallback, useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import type { Coordenadas } from "../types";

export type EstadoLocalizacao =
  | { status: "carregando" }
  | { status: "ok"; coords: Coordenadas }
  | { status: "negada"; podePedirDeNovo: boolean }
  | { status: "sem-posicao"; motivo: string };

const TIMEOUT_MS = 8000;

function comTimeout<T>(promessa: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promessa.then(
      (valor) => {
        clearTimeout(timer);
        resolve(valor);
      },
      (erro) => {
        clearTimeout(timer);
        reject(erro);
      },
    );
  });
}

export function useLocalizacao() {
  const [estado, setEstado] = useState<EstadoLocalizacao>({
    status: "carregando",
  });
  const ativo = useRef(true);

  const obter = useCallback(async () => {
    setEstado({ status: "carregando" });
    try {
      const permissao = await Location.requestForegroundPermissionsAsync();
      if (!ativo.current) return;
      if (!permissao.granted) {
        setEstado({ status: "negada", podePedirDeNovo: permissao.canAskAgain });
        return;
      }

      if (!(await Location.hasServicesEnabledAsync())) {
        if (ativo.current)
          setEstado({
            status: "sem-posicao",
            motivo: "O GPS do aparelho está desligado.",
          });
        return;
      }
      const posicao = await comTimeout(
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        }),
        TIMEOUT_MS,
      ).catch(() => Location.getLastKnownPositionAsync());
      if (!ativo.current) return;
      if (!posicao) {
        setEstado({
          status: "sem-posicao",
          motivo: "Não conseguimos obter sua posição agora.",
        });
        return;
      }
      setEstado({
        status: "ok",
        coords: {
          latitude: posicao.coords.latitude,
          longitude: posicao.coords.longitude,
        },
      });
    } catch {
      if (ativo.current)
        setEstado({
          status: "sem-posicao",
          motivo: "Ocorreu um erro ao consultar o GPS.",
        });
    }
  }, []);

  useEffect(() => {
    ativo.current = true;
    void obter();
    return () => {
      ativo.current = false;
    };
  }, [obter]);

  return { estado, tentarNovamente: obter };
}
