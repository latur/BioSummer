library("adabag")

filename <- "/Users/latur/Documents/Bio/BioSummer/Boost/svm/full.csv"
data <- read.csv(filename)
size <- length(data[[1]])
data <- data[,2:ncol(data)]

e <- boosting(type~., data=data, boos=TRUE, mfinal=10)
importanceplot(e)

L <- c()
for (colname in colnames(data)) {
  if (colname != "type") {
    s <- sum(data[[colname]])
    L <- c(L, list(n = colname, v = s))
  }
}

L <- as.list(L)
vals <- sapply(L,"[[","v")
cnames <- sapply(L,"[[","n")
goodOrder <- cnames[order(vals)]
