FROM haskell:8.0

MAINTAINER Adrien Loustaunau

# install latex packages
RUN apt-get update -y

# will ease up the update process
# updating this env variable will trigger the automatic build of the Docker image
ENV PANDOC_VERSION "2.2.1"

# install pandoc
RUN cabal update && cabal install pandoc-${PANDOC_VERSION}

WORKDIR /source

#ENTRYPOINT ["/root/.cabal/bin/pandoc"]
###
#CMD ["--help"]

#Intall golang
RUN apt-get install -y golang
ADD . /usr/lib/go/src/pkg/hello-app
RUN go install hello-app 
RUN cp /usr/lib/go/bin/* .
#ENTRYPOINT ["./hello-app"]
