function k = vecindad(a_init, a_final, z1, z2, k, kmax)
    alphak = a_init * (a_final / a_init)^(k/kmax);
    k = exp(-(norma(z1, z2)^2)/(2*alphak^2));
endfunction