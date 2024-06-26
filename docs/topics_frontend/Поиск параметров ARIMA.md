# Поиск параметров ARIMA
В общем случае вычисление начальных оценок процесса $\text{ARMA}(p, q)$ основано на первых $p + q + 1$ автоковариациях $c_j, j = 0, 1, ... , (p + q)$

Параметры авторегрессии $\phi_1, \phi_2,...,\phi_p$ оцениваются как решения системы

**Или как Юла-Уокера, только вместо автокорреляции автоковариацию**
![](arima_find_params.png)

оценка дисперсии остаточного ряда: $\large\sigma^2_a = \frac{c'_0}{1 + \theta^2_1 + ... + \theta^2_q},\ \ \ a\text{ - стационарный шум}$

тогда оценка коэффициентов скользящего среднего:

$\Large\theta_j = -(\frac{c'j}{\sigma^2_a} - \theta_1\theta_{j+1} - \theta_2\theta_{j+2} - \theta_{q-j}\theta_q)$
