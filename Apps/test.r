# r --max-ppsize=500000

install.packages("adabag")
install.packages("kernlab")

library("kernlab")
library("adabag")

# SVM
SVMTrainTest <- function(data, repeats){
  m <- dim(data)[2]
  n <- dim(data)[1]
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

path <- "/Volumes/Mac/Users/latur/Public/BioSummer/CSV/"
dataset <- c(
  "COAD.HNSC.G0.csv",
  "COAD.HNSC.G1.csv",
  "COAD.HNSC.G2.csv",
  "COAD.KICH.G0.csv",
  "COAD.KICH.G1.csv",
  "COAD.KICH.G2.csv",
  "HNSC.KICH.G0.csv",
  "HNSC.KICH.G1.csv",
  "HNSC.KICH.G2.csv",
  "HNSC.KIRC.G0.csv",
  "HNSC.KIRC.G1.csv",
  "HNSC.KIRC.G2.csv",
  "KICH.KIRP.G0.csv",
  "KICH.KIRP.G1.csv",
  "KICH.KIRP.G2.csv",
  "KIRP.COAD.G0.csv",
  "KIRP.COAD.G1.csv",
  "KIRP.COAD.G2.csv",
  "KIRP.HNSC.G0.csv",
  "KIRP.HNSC.G1.csv",
  "KIRP.HNSC.G2.csv"
)

log  <- c()
Test <- function(name){
  file <- paste(path, name, sep = "")
  data <- read.csv(file)
  data <- data[,c(2:2000, ncol(data))]
  ada  <- boosting(type~., data=data, boos=TRUE, mfinal=10)
  main <- names(ada$importance[ada$importance != 0])
  test <- SVMTrainTest(data[c(main, "type")], 1000)
  log <<- c(log, c(name, length(main), mean(test)))
}

for (file in dataset) Test(file)

