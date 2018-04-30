function gradopertenencia = gradopertenencia(distancia, i, j, b)
  gradopertenencia = ((1/distancia(i,j))^(1/(b-1))) / ((sum(1./distancia(:, j)))^(1/(b-1)));
endfunction
