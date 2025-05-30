# This script should run on an Intel Mac.
#
# It builds the "pre-10.15" and default macOS releases. The default release will also be
# signed/notarized so that macOS does not complain about it as much to users.
#
# It also does the Docker Hub release which uses Alpine Linux.
#
# It requires you to copy the gon-config-prebuild.json and gon-config-build-intel.json files from
# the ./dependencies directory into the root (one higher than here) directory, and populate
# them with your Apple Developer credentials.
# You also need to bump the versions in those files before each release. That should probably
# be automated later.
#
# The Docker part requires permission to push to universalmediaserver/ums.

cd ..

# Clear the folder for a clean build
rm UMS-macOS-*
rm -fr target/ums*
rm -rf target/antrun
rm -rf target/archive-tmp
rm -rf target/classes
rm -rf target/generated-sources
rm -rf target/generated-test-sources
rm -rf target/maven-archiver
rm -rf target/surefire-reports
rm -rf target/test-classes

mvn -P macos package -DskipTests=true

mvn -P docker prepare-package -DskipTests=true
mvn -P docker package -DskipTests=true
mvn -P docker install -DskipTests=true

./scripts/dependencies/gon ./gon-config-prebuild.json
./scripts/dependencies/gon ./gon-config-build-intel.json

Clear the folder for a clean build
rm UMS--pre10.15.dmg
rm -fr target/ums*
rm -rf target/antrun
rm -rf target/archive-tmp
rm -rf target/classes
rm -rf target/generated-sources
rm -rf target/generated-test-sources
rm -rf target/maven-archiver
rm -rf target/surefire-reports
rm -rf target/test-classes

mvn -P macos-pre1015 package -DskipTests=true

hdiutil create -volname "Universal Media Server" -srcfolder target/ums-*-distribution -fs HFS+ UMS-macOS--pre10.15.dmg
