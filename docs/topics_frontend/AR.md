## Авторегрессионные модели (AR)

**Текущие наблюдения зависят от результата предыдущих**

Нам понадобится:

- Оператор сдвига назад (характеристический полином): $\large Bz_t = z_{t-1}$
- Оператор сдвига вперед: $\large Fz_t = z_{t+1}, F = B^{-1}$
- Разностный оператор сдвига назад: $\nabla z_t = z_t - z_{t-1} = (1-B)z_t$
- Разностный оператор сдвига вперед: $\nabla^{-1}z_t = \sum^{\infty}_{j=o}zt-j = (1-B)^{-1}z_t$



Модель авторегрессии порядка p:

Значения ряда “регрессируют” на своих предыдущих значениях

$\Large AP(p): \tilde z_t = \phi_1\tilde z_{t-1} + \phi_2\tilde z_{t-2} + ... + \phi_p\tilde z_{t-p} + a_t$

p - сколько предыдущих точек формирует наблюдение

$\tilde z_t$ - текущая точка, которая зависит от предыдущих точек помноженные на коэффициенты

$a_t$ - стационарный шум

Можно упростить и записать как:

$\color{gold}\Large\phi(B)\tilde z_t = a_t$

Функционал оператора сдвига назад: $\phi(B) = 1 - \phi_1B-\phi_2B^2-...-\phi_pB^p$

![[Untitled3.png]]















