function v = som()

    data = load("Iris2Clases.txt");
    y = data(:,end);
    data(:,end) = [];
    X = data;
    K = 2;
    epsilon = 10^-6;
    iter = 0;
    maxiter = 1000;
    alpha_init = 0.1;
    alpha_final = 0.01;
    aprendizaje = 0.1;
    T = 10^-5;
    v = [4.6, 3.0, 4.0, 0.0 ; 6.8, 3.4, 4.6, 0.7];

    do
        iter += 1;
        for i = 1:rows(X)
            v_ant = v;
            for j = 1:K
                k = vecindad(alpha_init, alpha_final, X(i,:), v(j,:), iter, maxiter);
                
                if(k > T)
                    v(j,:) = v(j,:) + aprendizaje * k * (X(i,:) - v(j,:));
                endif
            endfor

        endfor
    until (iter >= maxiter || (abs(v(1,:) - v_ant(1,:)) < epsilon && abs(v(2,:) - v_ant(2,:)) < epsilon))

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
