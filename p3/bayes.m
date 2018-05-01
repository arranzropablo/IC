function [C1, C2] = bayes()

  data = load("Iris2Clases.txt");
  y = data(:,end);
  data(:,end) = [];
  X = data;
  K = 2;

  idx = find(y == 0);
  X1 = X(idx, :);
  idx = find(y == 1);
  X2 = X(idx, :);

  %Calculo de m
  m1 = sum(X1) ./ rows(X1);
  m2 = sum(X2) ./ rows(X2);

  %Calculo de C
  C1 = ((X1-m1)' * (X1 - m1)) ./ rows(X1);
  C2 = ((X2-m2)' * (X2 - m2)) ./ rows(X2);

%Cargamos los 3 datos de ejemplo y comprobamos a que clase pertenece cada uno
    data = [];
    X = [];
    data(1,:) = load("TestIris01.txt");
    data(2,:) = load("TestIris02.txt");
    data(3,:) = load("TestIris03.txt");

    y = data(:,end);
    data(:,end) = [];
    X = data;

%no se calcular la verosimilitud, de momento devuelvo los centros? (no se si tienen q dar 4x4)
    verosimilitud = (1/((2*pi)* det(C1)^(1/2)))*exp((-1/2)*((X-m1) * pinv(C1)) * (X - m1)');

endfunction
