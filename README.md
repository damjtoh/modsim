# Sistemas dinámicos de orden 1 autonomo

Este aplicativo fue realizado para la materia Modelado y Simulación de la Universidad Argentina de la Empresa.
El objetivo de este aplicativo es el de generar un diagrama de fases y una animación partiendo de una función y un punto.

## Cómo funciona la animación?

- Al hacer click en el diagrama de fases obtenemos el valor de la coordenada de x, [evaluamos la función de f()](https://github.com/damjtoh/modsim/blob/main/components/AnimatedPoint.tsx#L20) en ese punto y eso nos brinda dos cosas, por un lado el valor inicial de x y por otro la velocidad inicial. Estos dos valores junto a un timer que comienza a correr al presionar click van a generar la animación. Con la siguiente [ecuación](https://github.com/damjtoh/modsim/blob/main/components/AnimatedPoint.tsx#L27) `coordenada inicial + velocidad * tiempo` vamos a generar la proxima coordinada a mover la flecha. Luego hacemos un llamado recursivo incrementando el tiempo en un valor muy pequeno, para generar el movimiento.

## Cómo calculamos los puntos de equilibrio?

- [Buscamos las raices](https://github.com/damjtoh/modsim/blob/main/pages/api/dynamic.ts#L16) de la función y mediante calculos [auxiliares](https://github.com/damjtoh/modsim/blob/main/pages/api/dynamic.ts#L55) podemos saber si es un punto atractor o repulsor.

## Herramientas utilizadas

Se utilizaron diversas herramientas de código abierto, se decidió trabajar con el lenguaje JavaScript por familiaridad, sabiendo las limitaciones que tiene.

- React / Nextjs
- algebra.js
- function-plot
- equation-resolver

## Limitaciones

- La biblioteca `algebra.js` cuya última versión fué lanzada en el año 2015, ha sido deprecada y posee multiples limitantes, entre ellas no poder resolver ecuaciones trigonometricas o cuarticas.

## Demo

Para visualizar el aplicativo en funcionamiento se puede ingresar al siguiente sitio: https://modsim.vercel.app/
