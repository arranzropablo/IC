function v = lloyd()

    data = load("Iris2Clases.txt");
    y = data(:,end);
    data(:,end) = [];
    X = data;
    K = 2;
    epsilon = 10^-10;
    iter = 0;
    maxiter = 10;
    alpha = 0.1;
    v = [4.6, 3.0, 4.0, 0.0 ; 6.8, 3.4, 4.6, 0.7];
    %para el primer ejemplo cogemos la minima distancia entre los dos centros
    do
        for i = 1:rows(X)
            v_ant = v;
            if(norma(X(i,:), v(1,:)) < norma(X(i,:), v(2,:)))
                v(1,:) = v(1,:) + alpha*(X(i,:) - v(1,:));
            else
                v(2,:) = v(2,:) + alpha*(X(i,:) - v(2,:));
            endif
        endfor
        iter += 1;
    until (iter >= maxiter || (abs(v(1,:) - v_ant(1,:)) < epsilon && abs(v(2,:) - v_ant(2,:)) < epsilon))

    %Cargamos los 3 datos de ejemplo y comprobamos a que clase pertenece cada uno
    data = [];
    X = [];
    data(1,:) = load("TestIris01.txt");
    data(2,:) = load("TestIris02.txt");
    data(3,:) = load("TestIris03.txt");

    y = data(:,end);
    data(:,end) = [];
    X = data;

    for i = 1:rows(X)
        if(norma(X(i,:), v(1,:)) < norma(X(i,:), v(2,:)) && y(i,:) == 0)
            printf("is: Iris-setosa ; classified as: Iris-setosa ; \t right \n");
        elseif (norma(X(i,:), v(1,:)) < norma(X(i,:), v(2,:)) && y(i,:) == 1)
            printf("is: Iris-versicolor ; classified as: Iris-setosa ; \t wrong \n");
        elseif (norma(X(i,:), v(1,:)) >= norma(X(i,:), v(2,:)) && y(i,:) == 1)
            printf("is: Iris-versicolor ; classified as: Iris-versicolor ; \t right \n");
        elseif (norma(X(i,:), v(1,:)) >= norma(X(i,:), v(2,:)) && y(i,:) == 0)
            printf("is: Iris-setosa ; classified as: Iris-versicolor ; \t wrong \n");
        endif
    endfor

endfunction
