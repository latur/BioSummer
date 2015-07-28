# r --max-ppsize=500000

install.packages("adabag")
install.packages("kernlab")

library("kernlab")
library("adabag")

Train <- function(data, repeats){
  m <- dim(data)[2]
  n <- dim(data)[1]
  # x <- data[, 2:(m-1)]
  x <- data[, 1:(m-1)]
  y <- data[, m]
  result <- c();
  for (i in 1:repeats) {
    print(i);
    ntrain <- round(n * 0.8)
    tindex <- sample(n, ntrain)
    xtrain <- x[tindex,]
    xtest <- x[-tindex,]
    ytrain <- y[tindex]
    ytest <- y[-tindex]
    istrain = rep(0, n)
    rownames(xtrain) <- NULL
    rownames(xtest) <- NULL
    istrain[tindex] = 1
    svp <- ksvm(as.matrix(xtrain), ytrain, type="C-bsvc", kernel='rbf', C = 10, prob.model=TRUE, scale = FALSE)
    ypred = predict(svp,as.matrix(xtest))
    falses <- sum(ytest != ypred)
    total <- sum(ytest != ypred) + sum(ytest == ypred)
    ok <- 1-falses/total
    result<-c(result, ok)
  }
  result
}

AdaBoost <- function(filename){
  maingenes <- paste(filename, ".main", sep = "")
  testSVM   <- paste(filename, ".svm",  sep = "")

  data <- read.csv(filename)
  data <- data[,2:ncol(data)]
  ada  <- boosting(type~., data=data, boos=TRUE, mfinal=10)

  main <- names(ada$importance[ada$importance != 0])
  write.table(main, row.names = F, col.names = F, maingenes)

  test <- Train(data[c(main, "type")], 5000)
  write.table(test, row.names = F, col.names = F, testSVM)
}


AdaBoost("/Volumes/Mac/Users/latur/Public/BioSummer/CSV/KICH.KIRP.f1.csv")
AdaBoost("/Volumes/Mac/Users/latur/Public/BioSummer/CSV/KICH.HNSC.f1.csv")
AdaBoost("/Volumes/Mac/Users/latur/Public/BioSummer/CSV/KIRC.KIRP.f1.csv")
AdaBoost("/Volumes/Mac/Users/latur/Public/BioSummer/CSV/COAD.HNSC.f1.csv")

AdaBoost("/Volumes/Mac/Users/latur/Public/BioSummer/CSV/KICH.KIRP.f2.csv")
AdaBoost("/Volumes/Mac/Users/latur/Public/BioSummer/CSV/KICH.HNSC.f2.csv")
AdaBoost("/Volumes/Mac/Users/latur/Public/BioSummer/CSV/KIRC.KIRP.f2.csv")
AdaBoost("/Volumes/Mac/Users/latur/Public/BioSummer/CSV/COAD.HNSC.f2.csv")
