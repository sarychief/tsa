## Идея

Проекция метода: $\prod_{\mathcal{K}}(y) = \arg\min_{x\in\mathcal{K}}||y - x||_2$

- применяется к любым выпуклым функциям потерь
- хуже по качеству относительно ONS
- лучше в скорости вычислений относительно ONS

$\text{Algorithm 2 ARIMA-OGD(k,d,q)}$ 
$\text{Input: parameter k, d, q; learning rate } \eta$
$\text{Set } m = \log_{\lambda_{\max}} ((TLM_{max}q)^{−1})$
$\text{for t=1 to T − 1 do}$ 
$\text{predict } \tilde X_t(\gamma^t) = \sum^{k+m}_{i=1}\gamma_i\nabla^dX_{t-i} + \sum^{d-1}_{i=0}\nabla^iX_{t-1}$
$\text{receive } X_t \text{ and incur loss } \ell^m_t(\gamma^t)$ 
$\text{Let }\nabla_t = \nabla\ell^m_t(\gamma^t)$
$\text{Set }\gamma^{t+1} \leftarrow \prod_{\mathcal{K}}(\gamma^t - \frac{1}{\eta}\nabla_t)$ 
$\text{end for}$

---

## Алгоритм

Данный алгоритм представляет онлайн-градиентный спуск для обновления параметров модели ARIMA (ARIMA-OGD). 

В кратце:

1. Инициализация: Задаются параметры модели $\text{ARIMA (k, d, q)}$ и learning rate ($\eta$). Вычисляется m с использованием максимального собственного значения $(\lambda_{\max})$ и максимального времени жизни $(TLM_{max}$).
2. Итерации: Проводится цикл по времени $(t=1 \text{ to } T-1)$, где T - общее число временных шагов. На каждом временном шаге:
    - Прогнозирование: Вычисляется прогноз $\tilde X_t(\gamma^t)$ на основе параметров модели.
    - Получение данных: Получаются наблюдаемые данные $X_t$ и рассчитывается функция потерь $\ell^m_t(\gamma^t)$.
    - Вычисление градиента: Рассчитывается градиент $\nabla_t$ функции потерь по параметрам модели.
    - Обновление параметров: Параметры $\gamma$ обновляются с использованием проекции на множество $\mathcal{K}$ и градиентного шага.
3. Окончание: Цикл завершается после $T-1$ временного шага.

Этот алгоритм представляет собой итеративный процесс, в котором модель обновляется на основе градиентов функции потерь, что позволяет адаптироваться к изменениям в данных в режиме онлайн.

