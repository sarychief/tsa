- Модель авторегрессии - скользящего среднего (p, q):

модель стационнарная

$\large\text{АРСС}(p,q) = \text{ARMA}(p, q)$

$\large\tilde z_t = \phi_1\tilde z_{t-1} + \phi_2\tilde z_{t-2} + ... + \phi_p\tilde z_{t-p} + a_t - \theta_1a_{t-1}-\theta_2a_{t-2}-...-\theta_qa_{t-q},$

$\Large\phi(B)\tilde z_t = \theta(B)a_t$

- Модель авторегрессии - проинтегрированного скользящего-среднего:

$\large\text{АРПСС}(p,d,q) = \text{ARIMA}(p,d,q)$

$\Large\phi(B)(1-b)^d\tilde z_t = \theta(B)a_t$