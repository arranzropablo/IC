function [v, U] = kmedias()

  data = load('Iris2Clases.txt');
  y = data(:,end);
  data(:,end) = [];
  X = data;

  v = [4.6, 3.0, 4.0, 0.0 ; 6.8, 3.4, 4.6, 0.7];
  b = 2;
  epsilon = 0.02;
  K = 2;

do

    %Calculo de distancias primera vuelta
    for i = 1:K
      for j = 1:rows(X)
        distancia(i, j) = norma(X(j, :), v(i,:)) ^ 2;
      endfor
    endfor

    %Grados de pertenencia primera vuelta
    for i = 1:K
      for j = 1:rows(X)
        U(i, j) = gradopertenencia(distancia, i, j, b);
      endfor
    endfor

    v_anterior = v;

    for i = 1:K
      for j = 1:rows(X)
        dividendo(j, :) = (U(i, j)^b)*X(j, :);
      endfor

      for j = 1:rows(X)
        divisor(j, :) = U(i, j)^b;
      endfor

      v(i, :) = sum(dividendo) / sum(divisor); %quizas elem por elem

    endfor

  until (norma(v(1,:), v_anterior(1,:)) < epsilon && norma(v(2,:), v_anterior(2,:)) < epsilon)

%HACER PARTE QUE SUELTE LOG DE LAS PERTENENCIAS DEL ENTRENAMIENTO, EN QUE GRADo ESTAN BIEN CLASIFICADOS Y LO MISMO CON LO DE ABAJO
  %esto deberia imprimir pero no va
  for i = 1:rows(X)
    if (U(1,i) > U(2, i) && y == 0)
      printf('is: Iris-setosa ; classified as: Iris-setosa ; \t &#10003; \n');
    elsif (U(1,i) > U(2, i) && y == 1)
      printf("is: Iris-versicolor ; classified as: Iris-setosa ; \t &#10060; \n");
    elsif (U(1,i) <= U(2, i) && y == 1)
      printf("is: Iris-versicolor ; classified as: Iris-versicolor ; \t &#10003; \n");
    elsif (U(1,i) <= U(2, i) && y == 0)
      printf("is: Iris-setosa ; classified as: Iris-versicolor ; \t &#10060; \n");
    endif

  endfor


%Cargamos los 3 datos de ejemplo y comprobamos a que clase pertenece cada uno
    data = [];
    distancia = [];
    U = [];
    X = [];
    data(1,:) = load('TestIris01.txt');
    data(2,:) = load('TestIris02.txt');
    data(3,:) = load('TestIris03.txt');

    y = data(:,end);
    data(:,end) = [];
    X = data;

    %Calculo de distancias primera vuelta
    for i = 1:K
      for j = 1:rows(X)
        distancia(i, j) = norma(X(j, :), v(i,:)) ^ 2;
      endfor
    endfor

    %Grados de pertenencia primera vuelta
    for i = 1:K
      for j = 1:rows(X)
        U(i, j) = gradopertenencia(distancia, i, j, b);
      endfor
    endfor

endfunction
